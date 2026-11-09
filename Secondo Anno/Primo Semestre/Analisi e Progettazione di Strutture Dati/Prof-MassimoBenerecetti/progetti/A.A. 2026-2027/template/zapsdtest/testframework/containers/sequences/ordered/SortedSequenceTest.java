package zapsdtest.testframework.containers.sequences.ordered;

import apsd.interfaces.containers.sequences.ordered.SortedSequence;
import zapsdtest.testframework.containers.base.ordered.SortedIterableContainerTest;

public interface SortedSequenceTest<Data extends Comparable<? super Data>, Con extends SortedSequence<Con, Data>> extends OrderedSequenceTest<Data, Con>, SortedIterableContainerTest<Data, Con> {}
