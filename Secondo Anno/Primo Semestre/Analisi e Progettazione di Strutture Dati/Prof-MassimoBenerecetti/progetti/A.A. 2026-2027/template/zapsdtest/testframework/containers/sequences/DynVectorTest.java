package zapsdtest.testframework.containers.sequences;

import apsd.interfaces.containers.sequences.DynVector;
import apsd.classes.utilities.Natural;

import zapsdtest.testframework.containers.base.ResizableContainerTest;

import static org.junit.jupiter.api.Assertions.*;

public interface DynVectorTest<Data, Con extends DynVector<Con, Data>> extends VectorTest<Data, Con>, ResizableContainerTest<Con>, InsertableAtSequenceTest<Data, Con>, RemovableAtSequenceTest<Data, Con> {

  default void TestInsertAtWithAutoExpansion(Natural position, Data element) {
    BeginTest("InsertAtWithAutoExpansion");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().InsertAt(element, position);
    assertEquals(initialSize + 1, ThisContainer().Size().ToLong(), "InsertAt should automatically expand size");
    EndTest();
  }

  default void TestAtNRemoveWithAutoReduction(Natural position, Data expectedElement) {
    BeginTest("AtNRemoveWithAutoReduction");
    long initialSize = ThisContainer().Size().ToLong();
    assertEquals(expectedElement, ThisContainer().AtNRemove(position), "AtNRemove should return the removed element");
    assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "AtNRemove should automatically reduce size");
    EndTest();
  }

}
