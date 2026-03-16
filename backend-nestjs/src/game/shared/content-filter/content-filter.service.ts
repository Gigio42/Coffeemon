import { Injectable, OnModuleInit } from '@nestjs/common';
import { badWords } from '@bielgennaro/content-moderation';

@Injectable()
export class ContentFilterService implements OnModuleInit {
  private patterns: RegExp[] = [];

  onModuleInit() {
    this.patterns = badWords.map((word) => {
      const escaped = word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\s+/g, '\\s+');
      return new RegExp(`(?<![\\p{L}\\d])${escaped}(?![\\p{L}\\d])`, 'giu');
    });
  }

  clean(text: string): string {
    const normalized = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    let result = text;
    for (let i = 0; i < this.patterns.length; i++) {
      if (this.patterns[i].test(normalized)) {
        result = result.replace(this.patterns[i], (m) => '*'.repeat(m.length));
      }
    }
    return result;
  }
}
