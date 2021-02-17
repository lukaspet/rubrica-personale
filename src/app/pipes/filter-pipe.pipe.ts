import { Filiale } from './../mocker/filiale';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe'
})
export class FilterPipePipe implements PipeTransform {

  transform(items: any, filterText: string): any {
    if (!items || !filterText) {
      return items;
  }
  // filter items array, items which match and return true will be
  // kept, false will be filtered out
    return items.filter(
    item => item.filiale.toLowerCase().indexOf(filterText.toLowerCase()) !== -1);
  }

}
