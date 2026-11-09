package zapsdtest.simpletest.apsd.classes.containers.collections.concretecollections.generic;

import apsd.interfaces.containers.collections.List;
import zapsdtest.testframework.containers.ContainerBaseTest;
import zapsdtest.testframework.containers.collections.ListTest;

abstract public class XListTest<Con extends List<Con, Data>, Data> extends ContainerBaseTest<Con> implements ListTest<Data, Con> {}
