package zapsdtest.testframework.containers.sequences;

import apsd.interfaces.containers.sequences.Vector;
import apsd.classes.utilities.Natural;

import zapsdtest.testframework.containers.base.ReallocableContainerTest;

import static org.junit.jupiter.api.Assertions.*;

public interface VectorTest<Data, Con extends Vector<Con, Data>> extends MutableSequenceTest<Data, Con>, ReallocableContainerTest<Con> {

  default void TestShiftLeft(Natural start, Natural end, Natural number) {
    BeginTest("ShiftLeft");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftLeft(start, end, number);
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftLeft");
    if (initialSize == 0) {
      assertTrue(ThisContainer().IsEmpty(), "The resulting sequence should be empty");
    } else {
      Natural current = Natural.Of(initialSize - 1);
      for (long num = 0; num < number.ToLong() && !current.IsZero(); num++, current = current.Decrement()) {
        assertNull(ThisContainer().GetAt(current), "Position " + current + " should be null");
      }
    }
    EndTest();
  }

  default void TestShiftLeft(Natural position, Natural number) {
    BeginTest("ShiftLeft");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftLeft(position, number);
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftLeft");
    if (initialSize == 0) {
      assertTrue(ThisContainer().IsEmpty(), "The resulting sequence should be empty");
    } else {
      Natural current = Natural.Of(initialSize - 1);
      for(long num = 0; num < number.ToLong() && !current.IsZero(); num++, current = current.Decrement()) {
        assertNull(ThisContainer().GetAt(current), "Position " + current + " should be null");
      }
    }
    EndTest();
  }

  default void TestShiftLeft(Natural position) {
    BeginTest("ShiftLeft");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftLeft(position);
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftLeft");
    if (initialSize != 0) assertNull(ThisContainer().GetLast(), "Last position should be null");
    EndTest();
  }

  default void TestShiftFirstLeft() {
    BeginTest("ShiftFirstLeft");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftFirstLeft();
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftFirstLeft");
    if (initialSize != 0) assertNull(ThisContainer().GetLast(), "Last position should be null");
    EndTest();
  }

  default void TestShiftLastLeft() {
    BeginTest("ShiftLastLeft");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftLastLeft();
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftLastLeft");
    if (initialSize != 0) assertNull(ThisContainer().GetLast(), "Last position should be null");
    EndTest();
  }

  default void TestShiftRight(Natural start, Natural end, Natural number) {
    BeginTest("ShiftRight");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftRight(start, end, number);
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftRight");
    if (initialSize == 0) {
      assertTrue(ThisContainer().IsEmpty(), "The resulting sequence should be empty");
    } else {
      Natural current = start;
      for(long num = 0; num < number.ToLong() && current.ToLong() != initialSize; num++, current = current.Increment()) {
        assertNull(ThisContainer().GetAt(current), "Position " + current + " should be null");
      }
    }
    EndTest();
  }

  default void TestShiftRight(Natural position, Natural number) {
    BeginTest("ShiftRight");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftRight(position, number);
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftRight");
    if (initialSize == 0) {
      assertTrue(ThisContainer().IsEmpty(), "The resulting sequence should be empty");
    } else {
      Natural current = position;
      for(long num = 0; num < number.ToLong() && current.ToLong() != initialSize; num++, current = current.Increment()) {
        assertNull(ThisContainer().GetAt(current), "Position " + current + " should be null");
      }
    }
    EndTest();
  }

  default void TestShiftRight(Natural position) {
    BeginTest("ShiftRight");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftRight(position);
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftRight");
    if (initialSize != 0) assertNull(ThisContainer().GetAt(position), "Position " + position + " should be null");
    EndTest();
  }

  default void TestShiftFirstRight() {
    BeginTest("ShiftFirstRight");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftFirstRight();
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftFirstRight");
    if (initialSize != 0) assertNull(ThisContainer().GetFirst(), "First position should be null");
    EndTest();
  }

  default void TestShiftLastRight() {
    BeginTest("ShiftLastRight");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().ShiftLastRight();
    assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should be preserved after ShiftLastRight");
    if (initialSize != 0) assertNull(ThisContainer().GetLast(), "Last position should be null");
    EndTest();
  }

}
