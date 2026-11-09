package zapsdtest.simpletest.apsd.classes.containers.deqs;

import apsd.classes.containers.collections.concretecollections.LLList;
import apsd.classes.containers.deqs.WQueue;
import apsd.interfaces.containers.base.TraversableContainer;
import zapsdtest.simpletest.apsd.classes.containers.deqs.generic.WQueueITest;

public class LLQueueITest extends WQueueITest<WQueue<Long>> {

  public LLQueueITest() {
    System.out.println("**** LLQueueI (012) *********************************");
    name = "12 - LLQueueI";
  }

  @Override
  public void NewEmptyContainer() { container = new WQueue<>(new LLList<>()); }

  @Override
  public WQueue<Long> GetNewEmptyContainer() { return container.Empty(); }

  public WQueue<Long> GetNewNonEmptyContainer(TraversableContainer<?, Long> con) { return new WQueue<>(new LLList<>(), con); }

}
