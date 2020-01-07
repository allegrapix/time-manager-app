import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'filterTasks',
  pure: false
})
export class FilterTasksPipe implements PipeTransform {
  transform(value: any, filterString: string, propName: string) {
    if (filterString === 'all') {
      return value;
    }
    const tasksArray = [];
    for(const item of value) {
      if(item[propName] === filterString) {
        tasksArray.push(item);
      }
    }
    return tasksArray;
  }
}