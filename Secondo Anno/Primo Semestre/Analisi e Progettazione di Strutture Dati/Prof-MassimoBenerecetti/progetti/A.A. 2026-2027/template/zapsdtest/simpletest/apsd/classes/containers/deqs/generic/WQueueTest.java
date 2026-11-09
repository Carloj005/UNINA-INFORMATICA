package zapsdtest.simpletest.apsd.classes.containers.deqs.generic;

import apsd.interfaces.containers.deqs.Queue;
import zapsdtest.testframework.containers.ContainerBaseTest;
import zapsdtest.testframework.containers.deqs.QueueTest;

abstract public class WQueueTest<Con extends Queue<Con, Data>, Data> extends ContainerBaseTest<Con> implements QueueTest<Data, Con> {}
