import { isob, isnt, array_find, array_delete, sort_by_label } from "./util"
import Defaults from "./defaults"

const registered = {}

const Registry = {
    find: function(type, ob_or_id, key){
        var ob;
        if (isob(ob_or_id)) ob_or_id = ob_or_id[key || 'id'];
        if (ob_or_id) {
            if (isnt(registered[type])) {
                //console.log('finding first type', type);
                registered[type] = [];
            }
            ob = array_find(registered[type], ob_or_id, key);
            if (! ob) {
                ob = Defaults.module_for_type(type, ob_or_id);
                if (ob) {
                    registered[type].push(ob);
                    registered[type].sort(sort_by_label);
                } else console.error('could not find registered ' + type, ob_or_id);
        }
        }
        return ob;
    },
    register: function(type, media){
        if (! isarray(media)) media = [media];

        if (isob.apply(Util, media)) {
            var do_sort, found_ob, first_for_type, found_default, ob, i, z = media.length;
            if (z) {
                first_for_type = isnt(registered[type]);
                if (first_for_type) {
                    registered[type] = [];
                }
                for (i = 0; i < z; i++){
                    ob = media[i];
                    found_ob = array_find(registered[type], ob);
                    if ('com.moviemasher.' + type + '.default' === ob.id) {
                        found_default = true;
                        if (found_ob) { // overwriting default
                            array_delete(registered[type], found_ob);
                            found_ob = null;
                        }
                    }
                    if (! found_ob) {
                        if (! ob.type) ob.type = type;
                        registered[type].push(ob);
                        do_sort = true;
                    }
                }
            }
            if (first_for_type && (! found_default)) {
                ob = Defaults.module_for_type(type);
                if (ob) {
                    registered[type].push(ob);
                    do_sort = true;
                    registered[type].sort(sort_by_label);
                }
            }
            if (do_sort) registered[type].sort(sort_by_label);
        }
    },
}
export default Registry