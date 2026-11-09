package zapsdtest.simpletest.apsd.classes.containers.deqs.generic;

import apsd.interfaces.containers.deqs.Stack;
import zapsdtest.testframework.containers.ContainerBaseTest;
import zapsdtest.testframework.containers.deqs.StackTest;

abstract public class WStackTest<Con extends Stack<Con, Data>, Data> extends ContainerBaseTest<Con> implements StackTest<Data, Con> {}
