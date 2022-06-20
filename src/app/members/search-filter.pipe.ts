import { Pipe, PipeTransform } from '@angular/core';
import { IMember } from './Member';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  filtered!: IMember[];
  firstMatches!: IMember[];
  lastMatches!: IMember[];

  transform(members: IMember[], query?: string): any {
    if (!members || !query) {
      return members;
    }

    this.firstMatches = members.filter(
      (m) => m.name.first.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
    this.lastMatches = members.filter(
      (m) => m.name.last.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );

    this.filtered = this.firstMatches.concat(this.lastMatches);
    console.log(this.filtered);
    return this.filtered;
  }


}
