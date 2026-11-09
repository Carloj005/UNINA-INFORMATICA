package zapsdtest.testframework.containers.sequences;

import apsd.interfaces.containers.sequences.RemovableAtSequence;
import apsd.classes.utilities.Natural;

import zapsdtest.testframework.containers.base.RemovableContainerTest;

import static org.junit.jupiter.api.Assertions.*;

public interface RemovableAtSequenceTest<Data, Con extends RemovableAtSequence<Con, Data>> extends SequenceTest<Data, Con>, RemovableContainerTest<Data, Con> {

  default void TestRemoveAt(Natural position, boolean edgeCase) {
    BeginTest("RemoveAt");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().RemoveAt(position), "RemoveAt should throw exception for invalid position");
    } else {
      long initialSize = ThisContainer().Size().ToLong();
      ThisContainer().RemoveAt(position);
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after RemoveAt");
    }
    EndTest();
  }

  default void TestAtNRemove(Natural position, Data expectedElement, boolean edgeCase) {
    BeginTest("AtNRemove");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().AtNRemove(position), "AtNRemove should throw exception for invalid position");
    } else {
      long initialSize = ThisContainer().Size().ToLong();
      assertEquals(expectedElement, ThisContainer().AtNRemove(position), "AtNRemove should return the removed element");
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after AtNRemove");
    }
    EndTest();
  }

  default void TestRemoveFirst() {
    BeginTest("RemoveFirst");
    long initialSize = ThisContainer().Size().ToLong();
    if (initialSize == 0) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().RemoveFirst(), "RemoveFirst should throw exception on empty sequence");
    } else {
      ThisContainer().RemoveFirst();
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after RemoveFirst");
    }
    EndTest();
  }

  default void TestFirstNRemove(Data expectedElement) {
    BeginTest("FirstNRemove");
    long initialSize = ThisContainer().Size().ToLong();
    if (initialSize == 0) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().FirstNRemove(), "FirstNRemove should throw exception on empty sequence");
    } else {
      assertEquals(expectedElement, ThisContainer().FirstNRemove(), "FirstNRemove should return the first element");
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after FirstNRemove");
    }
    EndTest();
  }

  default void TestRemoveLast() {
    BeginTest("RemoveLast");
    long initialSize = ThisContainer().Size().ToLong();
    if (initialSize == 0) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().RemoveLast(), "RemoveLast should throw exception on empty sequence");
    } else {
      ThisContainer().RemoveLast();
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after RemoveLast");
    }
    EndTest();
  }

  default void TestLastNRemove(Data expectedElement) {
    BeginTest("LastNRemove");
    long initialSize = ThisContainer().Size().ToLong();
    if (initialSize == 0) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().LastNRemove(), "LastNRemove should throw exception on empty sequence");
    } else {
      assertEquals(expectedElement, ThisContainer().LastNRemove(), "LastNRemove should return the last element");
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after LastNRemove");
    }
    EndTest();
  }

}
