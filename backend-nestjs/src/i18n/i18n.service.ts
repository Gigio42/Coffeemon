import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class I18nService implements OnModuleInit {
  private translations: Record<string, Record<string, string>> = {};
  private effectTypeTranslations: Record<string, Record<string, string>> = {
    'pt-br': {
      burn: 'Queimadura',
      poison: 'Envenenamento',
      sleep: 'Sono',
      freeze: 'Congelamento',
      attackUp: 'Aumento de Ataque',
      defenseUp: 'Aumento de Defesa',
      defenseDown: 'Redução de Defesa',
      fixedHeal: 'um efeito de cura',
      lifesteal: 'Roubo de Vida',
      item: 'um item',
      revive: 'revitalização',
      status: 'um efeito de status',
    },
    en: {
      burn: 'Burn',
      poison: 'Poison',
      sleep: 'Sleep',
      freeze: 'Freeze',
      attackUp: 'Attack Up',
      defenseUp: 'Defense Up',
      defenseDown: 'Defense Down',
      fixedHeal: 'a healing effect',
      lifesteal: 'Lifesteal',
      item: 'an item',
      revive: 'revival',
      status: 'a status effect',
    },
  };

  onModuleInit() {
    this.loadTranslations();
  }

  private loadTranslations() {
    const dataPath = path.join(process.cwd(), 'src', 'game', 'data');
    const files = fs.readdirSync(dataPath);

    console.log(`[I18nService] Loading translations from: ${dataPath}`);

    files.forEach((file) => {
      if (file.startsWith('events-') && file.endsWith('.json')) {
        const lang = file.replace('events-', '').replace('.json', '');
        const translations_path = path.join(dataPath, file);
        const content = fs.readFileSync(translations_path, 'utf-8');
        this.translations[lang] = JSON.parse(content);
        console.log(`[I18nService] Loaded translations for: ${lang}`);
      }
    });
  }

  translate(key: string, lang: string = 'pt-br', payload: any = {}): string {
    const langFile = this.translations[lang] || this.translations['pt-br'];
    if (!langFile) {
      return `No translations available for lang: ${lang}`;
    }

    let message = langFile[key] || `Missing translation for key: ${key}`;

    if (payload) {
      const translatedPayload = { ...payload };
      if (payload.effectType) {
        const effectLang =
          this.effectTypeTranslations[lang] || this.effectTypeTranslations['pt-br'];
        translatedPayload.effectType = effectLang[payload.effectType] || payload.effectType;
      }

      for (const prop in translatedPayload) {
        message = message.replace(`{${prop}}`, translatedPayload[prop]);
      }
    }

    return message;
  }
}
