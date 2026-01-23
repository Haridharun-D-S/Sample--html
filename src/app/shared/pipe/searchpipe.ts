import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "Filter",
    pure: false
})
export class FilterPipe implements PipeTransform {
    constructor() { }

    public count;

    transform(items, searchText: string) {
        if(searchText){
            searchText = searchText.trim();
        }
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }
        searchText = searchText.toLocaleLowerCase();        
        const arr = items.filter((it) => {            
            return (
                it.toLocaleLowerCase().includes(searchText) 
            );
        });
        // this.count = arr.length;
         const norec = [ "No Records"];
        //  //console.log(arr,'filter');
         
        return arr.length == 0 ? [] :arr ;
    }
}

@NgModule({
  declarations: [FilterPipe],
  exports: [FilterPipe]
})
export class FilterPipeModule {}
