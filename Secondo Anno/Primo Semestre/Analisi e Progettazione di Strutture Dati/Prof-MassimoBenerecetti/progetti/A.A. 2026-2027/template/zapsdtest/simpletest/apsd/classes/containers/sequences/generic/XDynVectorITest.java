package zapsdtest.simpletest.apsd.classes.containers.sequences.generic;

import apsd.classes.utilities.Natural;
import apsd.interfaces.containers.sequences.DynVector;

import org.junit.jupiter.api.*;

abstract public class XDynVectorITest<Con extends DynVector<Con, Long>> extends XDynVectorTest<Con, Long> {

  @Override
  public void NewNonEmptyContainer() {
    AddTest(13);
    NewEmptyContainer();
    TestSetFirst(0L, true);
    TestExpandWithNumber(1L);
    TestSetFirst(0L, false);
    TestExpandWithNumber(4L);
    TestSize(5, false);
    TestSwap(Natural.ZERO, Natural.Of(3), false);
    TestSetFirst(4L, false);
    TestSetAt(3L, Natural.Of(1), false);
    TestSetAt(2L, Natural.Of(2), false);
    TestSetAt(1L, Natural.Of(5), true);
    TestSetLast(1L, false);
    TestSize(5, false);
    TestPrintContent("Initial Dynamic Vector");
  }

  @Nested
  @DisplayName("Vector Basics")
  public class VectorBasics {

    @Test
    @DisplayName("Check starting from an Empty Vector")
    public void Empty() {
      AddTest(9);
      NewEmptyContainer();
      TestGetFirst(0L, true);
      TestGetLast(0L, true);
      TestSetFirst(0L, true);
      TestSetLast(0L, true);
      TestGetAt(Natural.Of(1), 0L, true);
      TestSetAt(0L, Natural.Of(2), true);
      TestExists(4L, false);
      TestPrintContent("");
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 0L);
    }

    @Test
    @DisplayName("Check starting from a NonEmpty Vector")
    public void NonEmpty() {
      AddTest(34);
      NewNonEmptyContainer();
      TestGetFirst(4L, false);
      TestGetLast(1L, false);
      TestSetFirst(5L, false);
      TestSetLast(4L, false);
      TestExists(4L, true);
      TestFoldForward((dat, acc) -> acc + dat, 0L, 14L);
      TestFoldForward((dat, acc) -> acc * dat, 1L, 0L);
      TestGetAt(Natural.Of(3), 0L, false);
      TestSetAt(1L, Natural.Of(3), false);
      TestFoldForward((dat, acc) -> acc * dat, 1L, 120L);
      TestPrintContent("");
      TestShiftRight(Natural.ONE, Natural.ONE);
      TestPrintContent("");
      TestShiftLeft(Natural.ONE, Natural.ONE);
      TestPrintContent("");
      TestSetAt(5L, Natural.ZERO, false);
      TestSetAt(6L, Natural.Of(4), false);
      TestRealloc(2L);
      TestPrintContent("");
      TestFoldForward((dat, acc) -> acc * dat, 1L, 15L);
      TestRealloc(4L);
      TestShiftRight(Natural.ONE, Natural.Of(2));
      TestPrintContent("");
      TestSize(2L, false);
      TestShiftLeft(Natural.ZERO, Natural.ONE);
      TestSize(2L, false);
      TestShiftRight(Natural.ZERO, Natural.Of(2));
      TestPrintContent("");
      TestShiftFirstRight();
      TestShiftLastRight();
      TestSize(2L, false);
      TestPrintContent("");
      TestSetAt(5L, Natural.Of(1), false);
      TestPrintContent("");
      TestShiftRight(Natural.ZERO, Natural.Of(10));
      TestPrintContent("");
      TestClear();
      TestSize(0L, false);
    }

  }

}
