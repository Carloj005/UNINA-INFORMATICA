package zapsdtest.testframework.containers.collections.ordered;

import apsd.interfaces.containers.collections.ordered.OrderedCollection;
import zapsdtest.testframework.containers.base.ordered.OrderedIterableContainerTest;
import zapsdtest.testframework.containers.base.ordered.OrderedRemovableContainerTest;
import zapsdtest.testframework.containers.collections.CollectionTest;

public interface OrderedCollectionTest<Data extends Comparable<? super Data>, Con extends OrderedCollection<Con, Data>> extends CollectionTest<Data, Con>, OrderedRemovableContainerTest<Data, Con>, OrderedIterableContainerTest<Data, Con> {}
