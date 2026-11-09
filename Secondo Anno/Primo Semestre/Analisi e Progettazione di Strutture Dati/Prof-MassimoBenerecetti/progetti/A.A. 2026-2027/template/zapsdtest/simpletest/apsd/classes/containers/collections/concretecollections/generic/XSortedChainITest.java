package zapsdtest.simpletest.apsd.classes.containers.collections.concretecollections.generic;

import apsd.classes.utilities.Natural;
import apsd.interfaces.containers.collections.ordered.SortedChain;

import org.junit.jupiter.api.*;

abstract public class XSortedChainITest<Con extends SortedChain<Con, Long>> extends XSortedChainTest<Con, Long> {

  @Override
  public void NewNonEmptyContainer() {
    AddTest(11);
    NewEmptyContainer();
    TestInsert(4L, true);
    TestInsert(0L, true);
    TestInsert(5L, true);
    TestInsert(9L, true);
    TestInsert(2L, true);
    TestInsert(1L, true);
    TestInsert(0L, true);
    TestInsert(5L, true);
    TestInsert(1L, true);
    TestSize(9, false);
    TestPrintContent("Initial Sorted Chain");
  }

  @Nested
  @DisplayName("SortedChain Basics")
  public class SortedChainBasics {

    @Test
    @DisplayName("Check starting from an Empty SortedChain")
    public void Empty() {
      AddTest(9);
      NewEmptyContainer();
      TestGetFirst(0L, true);
      TestGetLast(0L, true);
      TestGetAt(Natural.Of(1), 0L, true);
      TestExists(0L, false);
      TestPrintContent("");
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 0L);
      TestRemove(0L, false);
      TestRemoveFirst();
      TestRemoveLast();
    }

    @Test
    @DisplayName("Check starting from a NonEmpty SortedChain")
    public void NonEmpty() {
      AddTest(20);
      NewNonEmptyContainer();
      TestGetFirst(0L, false);
      TestGetLast(9L, false);
      TestGetAt(Natural.Of(4), 2L, false);
      TestExists(4L, true);
      TestPrintContent("");
      TestFoldForward((dat, acc) -> acc + dat, 0L, 27L);
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 27L);
      TestRemoveFirst();
      TestFoldForward((dat, acc) -> acc + dat, 0L, 27L);
      TestRemoveLast();
      TestFoldForward((dat, acc) -> acc + dat, 0L, 18L);
      TestAtNRemove(Natural.Of(5), 5L, false);
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 13L);
      TestSize(6, false);
      TestInsert(3L, true);
      TestPrintContent("");
      TestSuccessor(6L, null);
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 16L);
      TestClear();
      TestSize(0, false);
    }

  }

}
