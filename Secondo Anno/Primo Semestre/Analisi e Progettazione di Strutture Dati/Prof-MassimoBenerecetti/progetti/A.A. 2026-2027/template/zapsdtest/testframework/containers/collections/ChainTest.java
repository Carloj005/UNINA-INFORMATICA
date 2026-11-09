package zapsdtest.testframework.containers.collections;

import apsd.interfaces.containers.collections.Chain;
import zapsdtest.testframework.containers.sequences.RemovableAtSequenceTest;

public interface ChainTest<Data, Con extends Chain<Con, Data>> extends CollectionTest<Data, Con>, RemovableAtSequenceTest<Data, Con> {}
