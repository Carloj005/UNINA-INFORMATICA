package zapsdtest.testframework.containers.sequences.ordered;

import apsd.interfaces.containers.sequences.ordered.SortedRemovableAtSequence;

public interface SortedRemovableAtSequenceTest<Data extends Comparable<? super Data>, Con extends SortedRemovableAtSequence<Con, Data>> extends OrderedRemovableAtSequenceTest<Data, Con>, SortedSequenceTest<Data, Con> {}
