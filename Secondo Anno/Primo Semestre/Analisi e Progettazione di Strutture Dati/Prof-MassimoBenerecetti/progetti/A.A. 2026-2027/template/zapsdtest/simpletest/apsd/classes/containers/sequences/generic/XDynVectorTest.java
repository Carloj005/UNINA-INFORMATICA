package zapsdtest.simpletest.apsd.classes.containers.sequences.generic;

import apsd.interfaces.containers.sequences.DynVector;
import zapsdtest.testframework.containers.ContainerBaseTest;
import zapsdtest.testframework.containers.sequences.DynVectorTest;

abstract public class XDynVectorTest<Con extends DynVector<Con, Data>, Data> extends ContainerBaseTest<Con> implements DynVectorTest<Data, Con> {}
