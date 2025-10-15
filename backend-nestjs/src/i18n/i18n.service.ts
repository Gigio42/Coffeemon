import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class I18nService implements OnModuleInit {
  private translations: Record<string, Record<string, string>> = {};

  onModuleInit() {
    this.loadTranslations();
  }

  private loadTranslations() {
    const dataPath = path.join(__dirname, '..', '..', 'game', 'data');
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
      for (const prop in payload) {
        message = message.replace(`{${prop}}`, payload[prop]);
      }
    }

    return message;
  }
}
