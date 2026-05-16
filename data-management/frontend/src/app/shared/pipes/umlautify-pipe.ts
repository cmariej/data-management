import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'umlautify'
})
export class UmlautifyPipe implements PipeTransform {

  transform(text: string): string {

    const converted = text
      .replace(/Ae/g, 'Ä')
      .replace(/Oe/g, 'Ö')
      .replace(/Ue/g, 'Ü')
      .replace(/ae/g, 'ä')
      .replace(/oe/g, 'ö')
      .replace(/ue/g, 'ü');

    return converted
      .split(' ')
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }
}