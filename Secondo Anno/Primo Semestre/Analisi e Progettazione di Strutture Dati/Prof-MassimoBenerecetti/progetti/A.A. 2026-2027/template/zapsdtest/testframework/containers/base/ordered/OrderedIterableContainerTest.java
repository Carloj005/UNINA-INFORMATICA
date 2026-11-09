package zapsdtest.testframework.containers.base.ordered;

import static org.junit.jupiter.api.Assertions.*;

import apsd.interfaces.containers.base.ordered.OrderedIterableContainer;

import zapsdtest.testframework.containers.base.IterableContainerTest;

public interface OrderedIterableContainerTest<Data extends Comparable<? super Data>, Con extends OrderedIterableContainer<Con, Data>> extends OrderedTraversableContainerTest<Data, Con>, IterableContainerTest<Data, Con> {}
