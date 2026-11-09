package zapsdtest.testframework.containers.collections;

import apsd.interfaces.containers.collections.List;
import zapsdtest.testframework.containers.sequences.InsertableAtSequenceTest;
import zapsdtest.testframework.containers.sequences.MutableSequenceTest;

public interface ListTest<Data, Con extends List<Con, Data>> extends ChainTest<Data, Con>, MutableSequenceTest<Data, Con>, InsertableAtSequenceTest<Data, Con> {}
