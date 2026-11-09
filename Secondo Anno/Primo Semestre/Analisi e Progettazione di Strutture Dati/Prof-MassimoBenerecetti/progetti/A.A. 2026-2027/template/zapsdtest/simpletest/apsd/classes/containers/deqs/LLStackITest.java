package zapsdtest.simpletest.apsd.classes.containers.deqs;

import apsd.classes.containers.collections.concretecollections.LLList;
import apsd.classes.containers.deqs.WStack;
import apsd.interfaces.containers.base.TraversableContainer;
import zapsdtest.simpletest.apsd.classes.containers.deqs.generic.WStackITest;

public class LLStackITest extends WStackITest<WStack<Long>> {

  public LLStackITest() {
    System.out.println("**** LLStackI (010) *********************************");
    name = "10 - LLStackI";
  }

  @Override
  public void NewEmptyContainer() { container = new WStack<>(new LLList<>()); }

  @Override
  public WStack<Long> GetNewEmptyContainer() { return container.Empty(); }

  public WStack<Long> GetNewNonEmptyContainer(TraversableContainer<?, Long> con) { return new WStack<>(new LLList<>(), con); }

}
