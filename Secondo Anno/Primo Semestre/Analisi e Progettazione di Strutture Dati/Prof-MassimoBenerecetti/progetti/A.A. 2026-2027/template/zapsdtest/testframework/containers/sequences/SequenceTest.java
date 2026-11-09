package zapsdtest.testframework.containers.sequences;

import apsd.interfaces.containers.sequences.Sequence;
import apsd.classes.utilities.Natural;

import zapsdtest.testframework.containers.base.IterableContainerTest;

import static org.junit.jupiter.api.Assertions.*;

public interface SequenceTest<Data, Con extends Sequence<Con, Data>>
  extends IterableContainerTest<Data, Con> {

  default void TestGetAt(Natural position, Data expectedElement, boolean edgeCase) {
    BeginTest("GetAt");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class, () -> ThisContainer().GetAt(position), "GetAt should throw IndexOutOfBoundsException for invalid position");
    } else {
      assertEquals(expectedElement, ThisContainer().GetAt(position), "GetAt should return " + expectedElement + " at position " + position);
    }
    EndTest();
  }

  default void TestGetFirst(Data expectedElement, boolean edgeCase) {
    BeginTest("GetFirst");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class, () -> ThisContainer().GetFirst(), "GetFirst should throw exception when sequence is empty");
    } else {
      assertEquals(expectedElement, ThisContainer().GetFirst(), "GetFirst should return " + expectedElement);
    }
    EndTest();
  }

  default void TestGetLast(Data expectedElement, boolean edgeCase) {
    BeginTest("GetLast");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class, () -> ThisContainer().GetLast(), "GetLast should throw exception when sequence is empty");
    } else {
      assertEquals(expectedElement, ThisContainer().GetLast(), "GetLast should return " + expectedElement);
    }
    EndTest();
  }

  default void TestSearch(Data element, Natural expectedPosition) {
    BeginTest("Search");
    Natural position = ThisContainer().Search(element);
    assertEquals(expectedPosition, position, "Search should return position " + expectedPosition + " for " + element);
    EndTest();
  }

  default void TestIsInBound(Natural position, boolean edgeCase) {
    BeginTest("IsInBound");
    boolean result = ThisContainer().IsInBound(position);
    if (edgeCase) {
      assertFalse(result, "IsInBound should return false for position " + position);
    } else {
      assertTrue(result, "IsInBound should return true for position " + position);
    }
    EndTest();
  }

  default void TestExcIfOutOfBound(Natural position, boolean edgeCase) {
    BeginTest("ExcIfOutOfBound");
    if (edgeCase) {
      assertThrows(IndexOutOfBoundsException.class,
      () -> ThisContainer().ExcIfOutOfBound(position), "ExcIfOutOfBound should throw exception for invalid position");
    } else {
      assertEquals(position.ToLong(), ThisContainer().ExcIfOutOfBound(position), "ExcIfOutOfBound should return the index for valid position");
    }
    EndTest();
  }

  default void TestIsEqual(Sequence<?, Data> otherContainer, boolean shouldWork) {
    BeginTest("IsEqual");
    boolean result = ThisContainer().IsEqual(otherContainer);
    if (shouldWork) {
      assertTrue(result, "IsEqual (Sequence) should return true");
    } else {
      assertFalse(result, "IsEqual (Sequence) should return false");
    }
    EndTest();
  }

  default void TestSubSequence(Natural from, Natural to, boolean edgeCase) {
    BeginTest("SubSequence");
    Sequence<?, Data> subSequence = ThisContainer().SubSequence(from, to);
    if (edgeCase) {
      assertTrue(subSequence.IsEmpty(), "SubSequence should be empty");
    } else {
      assertNotNull(subSequence, "SubSequence should not return null");
      assertTrue(subSequence.Size().ToLong() <= ThisContainer().Size().ToLong(), "SubSequence should not be larger than original");
      for(Natural idx = Natural.ZERO; from.compareTo(to) <= 0; idx = idx.Increment(), from = from.Increment()) {
        assertEquals(ThisContainer().GetAt(from), subSequence.GetAt(idx), "Values at position " + idx + " and " + from + " should be equal");
      }
    }
    EndTest();
  }

}
