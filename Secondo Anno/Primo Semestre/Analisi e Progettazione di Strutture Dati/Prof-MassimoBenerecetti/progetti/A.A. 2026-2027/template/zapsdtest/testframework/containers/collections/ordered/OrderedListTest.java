package zapsdtest.testframework.containers.collections.ordered;

import apsd.interfaces.containers.collections.ordered.OrderedList;
import zapsdtest.testframework.containers.collections.ListTest;

public interface OrderedListTest<Data extends Comparable<? super Data>, Con extends OrderedList<Con, Data>> extends ListTest<Data, Con>, OrderedChainTest<Data, Con> {}
