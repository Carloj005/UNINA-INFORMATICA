package zapsdtest.simpletest.apsd.classes.containers.sequences;

import apsd.classes.containers.sequences.DynCircularVector;
import apsd.interfaces.containers.base.TraversableContainer;
import zapsdtest.simpletest.apsd.classes.containers.sequences.generic.XDynVectorITest;

public class DynCircularVectorITest extends XDynVectorITest<DynCircularVector<Long>> {

  public DynCircularVectorITest() {
    System.out.println("**** DynCircularVectorI (04) ************************");
    name = "04 - DynCircularVectorI";
  }

  @Override
  public void NewEmptyContainer() { container = new DynCircularVector<>(); }

  @Override
  public DynCircularVector<Long> GetNewEmptyContainer() { return container.Empty(); }

  public DynCircularVector<Long> GetNewNonEmptyContainer(TraversableContainer<?, Long> con) { return new DynCircularVector<>(con); }

}
