package zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections.generic;

import apsd.interfaces.containers.collections.ordered.OrderedSet;
import zapsdtest.testframework.containers.ContainerBaseTest;
import zapsdtest.testframework.containers.collections.ordered.OrderedSetTest;

abstract public class WOrderedSetTest<Con extends OrderedSet<Con, Data>, Data extends Comparable<? super Data>> extends ContainerBaseTest<Con> implements OrderedSetTest<Data, Con> {}
