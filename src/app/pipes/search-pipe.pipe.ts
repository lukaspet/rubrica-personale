import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  transform(items: any, searchText: string): any {
    if (!items || !searchText) {
      return items;
  }
  // filter items array, items which match and return true will be
  // kept, false will be filtered out
    return items.filter(item => item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
}
