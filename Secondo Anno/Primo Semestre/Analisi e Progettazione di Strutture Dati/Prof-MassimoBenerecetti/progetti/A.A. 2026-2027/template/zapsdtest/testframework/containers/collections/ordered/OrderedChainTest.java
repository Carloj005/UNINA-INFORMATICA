package zapsdtest.testframework.containers.collections.ordered;

import apsd.interfaces.containers.collections.ordered.OrderedChain;
import zapsdtest.testframework.containers.collections.ChainTest;
import zapsdtest.testframework.containers.sequences.ordered.OrderedRemovableAtSequenceTest;

public interface OrderedChainTest<Data extends Comparable<? super Data>, Con extends OrderedChain<Con, Data>> extends ChainTest<Data, Con>, OrderedCollectionTest<Data, Con>, OrderedRemovableAtSequenceTest<Data, Con> {}
