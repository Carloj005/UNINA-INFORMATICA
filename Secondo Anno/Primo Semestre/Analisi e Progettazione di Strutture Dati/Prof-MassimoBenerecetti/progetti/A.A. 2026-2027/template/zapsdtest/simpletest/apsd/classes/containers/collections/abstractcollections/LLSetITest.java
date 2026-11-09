package zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections;

import apsd.classes.containers.collections.abstractcollections.WSet;
import apsd.classes.containers.collections.concretecollections.LLList;
import apsd.interfaces.containers.base.TraversableContainer;
import zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections.generic.WSetITest;

public class LLSetITest extends WSetITest<WSet<Long>> {

  public LLSetITest() {
    System.out.println("**** LLSetI (14) ************************************");
    name = "14 - LLSetI";
  }

  @Override
  public void NewEmptyContainer() { container = new WSet<>(new LLList<>()); }

  @Override
  public WSet<Long> GetNewEmptyContainer() { return container.Empty(); }

  public WSet<Long> GetNewNonEmptyContainer(TraversableContainer<?, Long> con) { return new WSet<>(new LLList<>(), con); }

}
