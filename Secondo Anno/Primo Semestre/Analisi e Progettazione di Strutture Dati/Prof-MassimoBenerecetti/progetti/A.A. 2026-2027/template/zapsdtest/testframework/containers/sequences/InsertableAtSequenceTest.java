package zapsdtest.testframework.containers.sequences;

import apsd.interfaces.containers.sequences.InsertableAtSequence;
import apsd.classes.utilities.Natural;

import zapsdtest.testframework.containers.base.InsertableContainerTest;

import static org.junit.jupiter.api.Assertions.*;

public interface InsertableAtSequenceTest<Data, Con extends InsertableAtSequence<Con, Data>> extends SequenceTest<Data, Con>, InsertableContainerTest<Data, Con> {

  default void TestInsertAt(Data element, Natural position, boolean edgeCase) {
    BeginTest("InsertAt");
    long initialSize = ThisContainer().Size().ToLong();
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().InsertAt(element, position), "InsertAt should throw exception for invalid position");
    } else {
      ThisContainer().InsertAt(element, position);
      assertEquals(initialSize + 1, ThisContainer().Size().ToLong(), "Size should increase by 1 after InsertAt");
      assertEquals(element, ThisContainer().GetAt(position), "InsertAt should place element at correct position");
    }
    EndTest();
  }

  default void TestInsertFirst(Data element) {
    BeginTest("InsertFirst");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().InsertFirst(element);
    assertEquals(initialSize + 1, ThisContainer().Size().ToLong(), "Size should increase by 1 after InsertFirst");
    assertEquals(element, ThisContainer().GetFirst(), "InsertFirst should place element at beginning");
    EndTest();
  }

  default void TestInsertLast(Data element) {
    BeginTest("InsertLast");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().InsertLast(element);
    assertEquals(initialSize + 1, ThisContainer().Size().ToLong(), "Size should increase by 1 after InsertLast");
    assertEquals(element, ThisContainer().GetLast(), "InsertLast should place element at end");
    EndTest();
  }

}
