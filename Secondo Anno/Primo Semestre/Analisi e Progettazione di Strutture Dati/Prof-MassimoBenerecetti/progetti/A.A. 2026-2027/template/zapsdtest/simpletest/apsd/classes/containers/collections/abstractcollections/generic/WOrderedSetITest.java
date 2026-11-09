package zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections.generic;

import apsd.interfaces.containers.collections.ordered.OrderedSet;

import org.junit.jupiter.api.*;

abstract public class WOrderedSetITest<Con extends OrderedSet<Con, Long>> extends WOrderedSetTest<Con, Long> {

  @Override
  public void NewNonEmptyContainer() {
    AddTest(10);
    NewEmptyContainer();
    TestInsert(4L, true);
    TestInsert(0L, true);
    TestInsert(4L, false);
    TestInsert(3L, true);
    TestInsert(1L, true);
    TestInsert(3L, false);
    TestInsert(2L, true);
    TestInsert(0L, false);
    TestSize(5, false);
    TestPrintContent("Initial Ordered Set");
  }

  @Nested
  @DisplayName("WOrderedSet Basics")
  public class WOrderedSetBasics {

    @Test
    @DisplayName("Check starting from an Empty WOrderedSet")
    public void Empty() {
      AddTest(8);
      NewEmptyContainer();
      TestExists(0L, false);
      TestFilter(dat -> false);
      TestUnion(ThisContainer());
      TestIntersection(ThisContainer());
      TestDifference(ThisContainer());
      TestSize(0, false);
      TestMin(null);
      TestMax(null);
    }

    @Test
    @DisplayName("Check starting from a NonEmpty WOrderedSet")
    public void NonEmpty() {
      AddTest(35);
      NewNonEmptyContainer();
      TestMin(0L);
      TestMax(4L);
      TestRemoveMin();
      TestMinNRemove(1L);
      TestInsert(-1L, true);
      TestInsert(1L, true);
      TestMin(-1L);
      TestMaxNRemove(4L);
      TestSize(4, false);
      TestInsert(6L, true);
      TestSize(5, false);
      TestMax(6L);
      TestInsert(7L, true);
      TestSize(6, false);
      TestExists(6L, true);
      TestExists(8L, false);
      TestExists(0L, false);
      TestExists(-1L, true);
      TestExists(2L, true);
      TestRemove(5L, false);
      TestRemove(2L, true);
      TestExists(5L, false);
      TestExists(2L, false);
      TestRemoveMax();
      TestPrintContent("");
      TestPredecessor(4L, 3L);
      TestPredecessor(5L, 3L);
      TestSuccessor(2L, 3L);
      TestSuccessor(4L, 6L);
      TestPredecessorNRemove(7L, 6L);
      TestSuccessorNRemove(0L, 1L);
      TestFoldForward((dat, acc) -> acc + dat, 0L, 2L);
      TestFoldBackward((dat, acc) -> acc + dat, 0L, 2L);
      TestClear();
      TestSize(0, false);
    }

  }

}
