package zapsdtest.testframework.containers.sequences;

import apsd.interfaces.containers.sequences.MutableSequence;
import apsd.classes.utilities.Natural;

import zapsdtest.testframework.containers.base.MutableIterableContainerTest;

import static org.junit.jupiter.api.Assertions.*;

public interface MutableSequenceTest<Data, Con extends MutableSequence<Con, Data>> extends SequenceTest<Data, Con>, MutableIterableContainerTest<Data, Con> {

  default void TestSetAt(Data element, Natural position, boolean edgeCase) {
    BeginTest("SetAt");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().SetAt(element, position), "SetAt should throw exception for invalid position");
    } else {
      ThisContainer().SetAt(element, position);
      assertEquals(element, ThisContainer().GetAt(position), "SetAt should modify element at position " + position);
    }
    EndTest();
  }

  default void TestGetNSetAt(Data newElement, Data expectedOld, Natural position, boolean edgeCase) {
    BeginTest("GetNSetAt");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().SetAt(newElement, position), "GetNSetAt should throw exception for invalid position");
    } else {
      assertEquals(expectedOld, ThisContainer().GetNSetAt(newElement, position), "GetNSetAt should return original element");
      assertEquals(newElement, ThisContainer().GetAt(position), "GetNSetAt should set new element");
    }
    EndTest();
  }

  default void TestSetFirst(Data element, boolean edgeCase) {
    BeginTest("SetFirst");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().SetFirst(element), "SetFirst should throw exception when sequence is empty");
    } else {
      ThisContainer().SetFirst(element);
      assertEquals(element, ThisContainer().GetFirst(), "SetFirst should modify first element");
    }
    EndTest();
  }

  default void TestGetNSetFirst(Data newElement, Data expectedOld, boolean edgeCase) {
    BeginTest("GetNSetFirst");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().SetFirst(newElement), "SetFirst should throw exception when sequence is empty");
    } else {
      assertEquals(expectedOld, ThisContainer().GetNSetFirst(newElement), "GetNSetFirst should return original first element");
      assertEquals(newElement, ThisContainer().GetFirst(), "GetNSetFirst should set new first element");
    }
    EndTest();
  }

  default void TestSetLast(Data element, boolean edgeCase) {
    BeginTest("SetLast");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().SetLast(element), "SetLast should throw exception when sequence is empty");
    } else {
      ThisContainer().SetLast(element);
      assertEquals(element, ThisContainer().GetLast(), "SetLast should modify last element");
    }
    EndTest();
  }

  default void TestGetNSetLast(Data newElement, Data expectedOld, boolean edgeCase) {
    BeginTest("GetNSetLast");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().SetLast(newElement), "GetNSetLast should throw exception when sequence is empty");
    } else {
      assertEquals(expectedOld, ThisContainer().GetNSetLast(newElement), "GetNSetLast should return original last element");
      assertEquals(newElement, ThisContainer().GetLast(), "GetNSetLast should set new last element");
    }
    EndTest();
  }

  default void TestSwap(Natural firstPos, Natural secondPos, boolean edgeCase) {
    BeginTest("Swap");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> {
        ThisContainer().GetAt(firstPos);
        ThisContainer().GetAt(secondPos);
      },
      "TestSwap should throw exception for invalid position");
    } else {
      Data firstOriginal = ThisContainer().GetAt(firstPos);
      Data secondOriginal = ThisContainer().GetAt(secondPos);
      ThisContainer().Swap(firstPos, secondPos);
      assertEquals(secondOriginal, ThisContainer().GetAt(firstPos), "Swap should exchange elements");
      assertEquals(firstOriginal, ThisContainer().GetAt(secondPos), "Swap should exchange elements");
    }
    EndTest();
  }

}
