import * as basket      from './basket';
import * as dataLoader  from './dataLoader';
import * as tabs        from './tabs';
import * as filterItems from './filterItems';
import * as reload      from './reload';
import * as auth        from './auth';

export default {
    ...basket,
    ...dataLoader,
    ...tabs,
    ...filterItems,
    ...reload,
    ...auth
};
