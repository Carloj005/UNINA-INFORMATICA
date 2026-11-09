package zapsdtest.simpletest.apsd.classes.containers.collections.abstractcollections.generic;

import apsd.interfaces.containers.collections.Set;

import org.junit.jupiter.api.*;

abstract public class WSetITest<Con extends Set<Con, Long>> extends WSetTest<Con, Long> {

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
    TestPrintContent("Initial Set");
  }

  @Nested
  @DisplayName("WSet Basics")
  public class WSetBasics {

    @Test
    @DisplayName("Check starting from an Empty WSet")
    public void Empty() {
      AddTest(6);
      NewEmptyContainer();
      TestExists(0L, false);
      TestFilter(dat -> false);
      TestUnion(ThisContainer());
      TestIntersection(ThisContainer());
      TestDifference(ThisContainer());
      TestSize(0, false);
    }

    @Test
    @DisplayName("Check starting from a NonEmpty WSet")
    public void NonEmpty() {
      AddTest(38);
      NewNonEmptyContainer();
      Set<?, Long> newcon = GetNewEmptyContainer();
      newcon.Insert(3L);
      newcon.Insert(1L);
      newcon.Insert(5L);
      TestInsert(-1L, true);
      TestExists(1L, true);
      TestExists(2L, true);
      TestExists(3L, true);
      TestExists(5L, false);
      TestUnion(newcon);
      TestExists(1L, true);
      TestExists(3L, true);
      TestExists(5L, true);
      TestSize(7, false);
      TestDifference(newcon);
      TestExists(1L, false);
      TestExists(3L, false);
      TestExists(5L, false);
      TestSize(4, false);
      TestUnion(newcon);
      TestExists(1L, true);
      TestExists(3L, true);
      TestExists(5L, true);
      TestSize(7, false);
      TestAnyNull(false);
      TestIntersection(newcon);
      TestExists(-1L, false);
      TestExists(2L, false);
      TestSize(3, false);
      TestInsert(4L, true);
      TestInsert(0L, true);
      TestInsert(4L, false);
      TestInsert(3L, false);
      TestInsert(1L, false);
      TestInsert(3L, false);
      TestInsert(2L, true);
      TestInsert(0L, false);
      TestInsert(5L, false);
      TestPrintContent("");
      TestSize(6, false);
      TestClear();
      TestSize(0, false);
    }

  }

}
