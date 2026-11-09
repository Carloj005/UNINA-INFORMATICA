package zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections;

import apsd.classes.containers.collections.abstractcollections.WOrderedSet;
import apsd.interfaces.containers.base.TraversableContainer;
import zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections.generic.WOrderedSetITest;

public class VOrderedSetITest extends WOrderedSetITest<WOrderedSet<Long>> {

  public VOrderedSetITest() {
    System.out.println("**** VOrderedSetI (15) ******************************");
    name = "15 - VOrderedSetI";
  }

  @Override
  public void NewEmptyContainer() { container = new WOrderedSet<>(); }

  @Override
  public WOrderedSet<Long> GetNewEmptyContainer() { return container.Empty(); }

  public WOrderedSet<Long> GetNewNonEmptyContainer(TraversableContainer<?, Long> con) { return new WOrderedSet<>(con); }

}
