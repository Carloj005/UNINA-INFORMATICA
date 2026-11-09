package zapsdtest.testframework.containers.sequences.ordered;

import apsd.interfaces.containers.sequences.ordered.OrderedRemovableAtSequence;
import zapsdtest.testframework.containers.sequences.RemovableAtSequenceTest;

public interface OrderedRemovableAtSequenceTest<Data extends Comparable<? super Data>, Con extends OrderedRemovableAtSequence<Con, Data>> extends RemovableAtSequenceTest<Data, Con>, OrderedSequenceTest<Data, Con> {}
