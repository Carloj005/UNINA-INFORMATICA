package zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections;

import apsd.classes.containers.collections.abstractcollections.WOrderedSet;
import apsd.classes.containers.collections.concretecollections.LLSortedChain;
import apsd.interfaces.containers.base.TraversableContainer;
import zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections.generic.WOrderedSetITest;

public class LLOrderedSetITest extends WOrderedSetITest<WOrderedSet<Long>> {

  public LLOrderedSetITest() {
    System.out.println("**** LLOrderedSetI (16) *****************************");
    name = "16 - LLOrderedSetI";
  }

  @Override
  public void NewEmptyContainer() { container = new WOrderedSet<Long>(new LLSortedChain<>()); }

  @Override
  public WOrderedSet<Long> GetNewEmptyContainer() { return container.Empty(); }

  public WOrderedSet<Long> GetNewNonEmptyContainer(TraversableContainer<?, Long> con) { return new WOrderedSet<>(new LLSortedChain<>(), con); }

}
