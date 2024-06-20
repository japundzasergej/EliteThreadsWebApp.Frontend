import { Pipe, PipeTransform } from '@angular/core';
import { Memoize } from 'typescript-memoize';

@Pipe({
  name: 'enum',
  standalone: true,
})
export class EnumPipe implements PipeTransform {
  @Memoize()
  transform(value: any): { key: string; value: number }[] {
    return Object.keys(value)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({ key, value: value[key] }));
  }
}
