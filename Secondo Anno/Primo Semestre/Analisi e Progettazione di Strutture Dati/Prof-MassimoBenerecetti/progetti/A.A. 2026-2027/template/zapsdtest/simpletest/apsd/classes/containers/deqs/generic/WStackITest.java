package zapsdtest.simpletest.apsd.classes.containers.deqs.generic;

import apsd.interfaces.containers.deqs.Stack;

import org.junit.jupiter.api.*;

abstract public class WStackITest<Con extends Stack<Con, Long>> extends WStackTest<Con, Long> {

  @Override
  public void NewNonEmptyContainer() {
    AddTest(6);
    NewEmptyContainer();
    TestInsert(4L, true);
    TestPush(0L);
    TestInsert(3L, true);
    TestPush(1L);
    TestInsert(2L, true);
    TestSize(5, false);
  }

  @Nested
  @DisplayName("Stack Basics")
  public class StackBasics {

    @Test
    @DisplayName("Check starting from an Empty Stack")
    public void Empty() {
      AddTest(3);
      NewEmptyContainer();
      TestTop(null);
      TestPop(true);
      TestTopNPop(null, true);
    }

    @Test
    @DisplayName("Check starting from a NonEmpty Stack")
    public void NonEmpty() {
      AddTest(11);
      NewNonEmptyContainer();
      TestSize(4, true);
      TestTopNPop(2L, false);
      TestTop(1L);
      TestPush(5L);
      TestPush(6L);
      TestTop(6L);
      TestTopNPop(6L, false);
      TestPop(false);
      TestTop(1L);
      TestClear();
      TestTopNPop(null, true);
    }

  }

}
