package zapsdtest.simpletest.apsd.classes.containers.sequences;

import apsd.classes.containers.sequences.Vector;
import apsd.interfaces.containers.base.TraversableContainer;
import zapsdtest.simpletest.apsd.classes.containers.sequences.generic.XVectorITest;

public class VectorITest extends XVectorITest<Vector<Long>> {

  public VectorITest() {
    System.out.println("**** VectorI (01) ************************************");
    name = "01 - VectorI";
  }

  @Override
  public void NewEmptyContainer() { container = new Vector<>(); }

  @Override
  public Vector<Long> GetNewEmptyContainer() { return container.Empty(); }

  public Vector<Long> GetNewNonEmptyContainer(TraversableContainer<?, Long> con) { return new Vector<>(con); }

}
