package zapsdtest.testframework.containers.collections.ordered;

import apsd.interfaces.containers.collections.ordered.OrderedSet;
import zapsdtest.testframework.containers.collections.SetTest;

public interface OrderedSetTest<Data extends Comparable<? super Data>, Con extends OrderedSet<Con, Data>> extends SetTest<Data, Con>, OrderedCollectionTest<Data, Con> {}
