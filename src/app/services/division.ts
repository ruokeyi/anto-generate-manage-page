import {reactive} from 'vue';
import {http} from '@/app/services/http/http';

let division = reactive({
  initialized: false,
  countries: [] as any[],
  cascaderData: [] as any[],
});

export function useDivision() {
  if (!division.initialized) {
    (async () => {
      // todo: block in dev
      const {data} = await http.get('/x/admin/up-conn/conn/address');
      division.countries = data.country;
      division.cascaderData = data.country.map(({key, name, province}) => ({
        label: name,
        value: name,
        children:
          !province
            ? null
            : province.map(({key, name, city}) => ({
              label: name,
              value: name,
              children: !city
                ? null
                : city.map(({key, name}) => ({
                  value: name,
                  label: name,
                })),
            })),
      }));
    })();
  }
  return division;
}
