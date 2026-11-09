package zapsdtest.simpletest.apsd.classes.containers.collections.concretecollections.generic;

import apsd.interfaces.containers.collections.List;
import apsd.classes.utilities.Natural;

import org.junit.jupiter.api.*;

abstract public class XListITest<Con extends List<Con, Long>> extends XListTest<Con, Long> {

  @Override
  public void NewNonEmptyContainer() {
    AddTest(11);
    NewEmptyContainer();
    TestInsert(0L, true);
    TestInsertLast(4L);
    TestInsertFirst(5L);
    TestInsertLast(9L);
    TestInsertFirst(2L);
    TestInsertFirst(1L);
    TestInsert(0L, true);
    TestInsert(5L, true);
    TestInsertLast(1L);
    TestSize(9, false);
    TestPrintContent("Initial List");
  }

  @Nested
  @DisplayName("List Basics")
  public class ListBasics {

    @Test
    @DisplayName("Check starting from an Empty List")
    public void Empty() {
      AddTest(12);
      NewEmptyContainer();
      TestGetFirst(0L, true);
      TestGetLast(0L, true);
      TestSetFirst(0L, true);
      TestSetLast(0L, true);
      TestGetAt(Natural.Of(1), 0L, true);
      TestSetAt(0L, Natural.Of(2), true);
      TestExists(0L, false);
      TestPrintContent("");
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 0L);
      TestRemove(0L, false);
      TestRemoveFirst();
      TestRemoveLast();
    }

    @Test
    @DisplayName("Check starting from a NonEmpty List")
    public void NonEmpty() {
      AddTest(24);
      NewNonEmptyContainer();
      TestGetFirst(1L, false);
      TestGetLast(1L, false);
      TestSetFirst(2L, false);
      TestSetLast(6L, false);
      TestGetAt(Natural.Of(4), 4L, false);
      TestSetAt(3L, Natural.Of(4), false);
      TestExists(5L, true);
      TestPrintContent("");
      TestFoldForward((dat, acc) -> acc + dat, 0L, 32L);
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 32L);
      TestRemoveFirst();
      TestFoldForward((dat, acc) -> acc + dat, 0L, 30L);
      TestRemoveLast();
      TestFoldForward((dat, acc) -> acc + dat, 0L, 24L);
      TestAtNRemove(Natural.Of(5), 0L, false);
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 24L);
      TestSize(6, false);
      TestInsertAt(5L, Natural.Of(6), false);
      TestPrintContent("");
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 29L);
      TestInsertAt(5L, Natural.Of(4), false);
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 34L);
      TestClear();
      TestSize(0, false);
    }

  }

}
