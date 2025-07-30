import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMessageTime',
})
export class FormatMessageTimePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    return date.toLocaleTimeString();
  }
}
