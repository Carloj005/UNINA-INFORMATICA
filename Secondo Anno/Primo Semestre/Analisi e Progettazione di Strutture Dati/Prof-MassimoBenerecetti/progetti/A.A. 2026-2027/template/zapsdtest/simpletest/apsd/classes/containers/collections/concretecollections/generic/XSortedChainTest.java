package zapsdtest.simpletest.apsd.classes.containers.collections.concretecollections.generic;

import apsd.interfaces.containers.collections.ordered.SortedChain;
import zapsdtest.testframework.containers.ContainerBaseTest;
import zapsdtest.testframework.containers.collections.ordered.SortedChainTest;

abstract public class XSortedChainTest<Con extends SortedChain<Con, Data>, Data extends Comparable<? super Data>> extends ContainerBaseTest<Con> implements SortedChainTest<Data, Con> {}
