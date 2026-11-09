package zapsdtest.simpletest.apsd.classes.containers.sequences.generic;

import apsd.interfaces.containers.sequences.Vector;
import zapsdtest.testframework.containers.ContainerBaseTest;
import zapsdtest.testframework.containers.sequences.VectorTest;

abstract public class XVectorTest<Con extends Vector<Con, Data>, Data> extends ContainerBaseTest<Con> implements VectorTest<Data, Con> {}
