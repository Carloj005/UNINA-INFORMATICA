package zapsdtest.testframework.containers.base;

import apsd.classes.utilities.Natural;
import apsd.interfaces.containers.base.TraversableContainer;
import apsd.interfaces.traits.Predicate;
import apsd.interfaces.traits.Accumulator;

import static org.junit.jupiter.api.Assertions.*;

public interface TraversableContainerTest<Data, Con extends TraversableContainer<Con, Data>> extends MembershipContainerTest<Data, Con> {

  default void TestTraverseForwardNullPredicate() {
    BeginTest("TraverseForwardNullPredicate");
    boolean result = ThisContainer().TraverseForward(null);
    assertFalse(result, "TraverseForward with null predicate should return false");
    EndTest();
  }

  default void TestTraverseBackwardNullPredicate() {
    BeginTest("TraverseBackwardNullPredicate");
    boolean result = ThisContainer().TraverseBackward(null);
    assertFalse(result, "TraverseBackward with null predicate should return false");
    EndTest();
  }

  default void TestTraverseForward(Predicate<Data> predicate, boolean expected) {
    BeginTest("TraverseForward");
    boolean result = ThisContainer().TraverseForward(predicate);
    assertEquals(expected, result, "TraverseForward should return " + expected);
    EndTest();
  }

  default void TestTraverseBackward(Predicate<Data> predicate, boolean expected) {
    BeginTest("TraverseBackward");
    boolean result = ThisContainer().TraverseBackward(predicate);
    assertEquals(expected, result, "TraverseBackward should return " + expected);
    EndTest();
  }

  default <Acc> void TestFoldForwardNullAccumulator(Acc initial) {
    BeginTest("FoldForwardNullAccumulator");
    Acc result = ThisContainer().FoldForward(null, initial);
    assertEquals(initial, result, "FoldForward with null accumulator should return initial value");
    EndTest();
  }

  default <Acc> void TestFoldBackwardNullAccumulator(Acc initial) {
    BeginTest("FoldBackwardNullAccumulator");
    Acc result = ThisContainer().FoldBackward(null, initial);
    assertEquals(initial, result, "FoldBackward with null accumulator should return initial value");
    EndTest();
  }

  default <Acc> void TestFoldForward(Accumulator<Data, Acc> accumulator, Acc initial, Acc expected) {
    BeginTest("FoldForward");
    Acc result = ThisContainer().FoldForward(accumulator, initial);
    assertEquals(expected, result, "FoldForward should return " + expected);
    EndTest();
  }

  default <Acc> void TestFoldBackward(Accumulator<Data, Acc> accumulator, Acc initial, Acc expected) {
    BeginTest("FoldBackward");
    Acc result = ThisContainer().FoldBackward(accumulator, initial);
    assertEquals(expected, result, "FoldBackward should return " + expected);
    EndTest();
  }

  default void TestMultiplicity(Data element, long expected) {
    BeginTest("Multiplicity");
    Natural result = ThisContainer().Multiplicity(element);
    assertEquals(expected, result.ToLong(), "Multiplicity should return " + expected);
    EndTest();
  }

  default void TestIsEqualSelf() {
    BeginTest("IsEqualSelf");
    boolean result = ThisContainer().IsEqual(ThisContainer());
    assertTrue(result, "Container should be equal to itself");
    EndTest();
  }

  default void TestIsEqual(TraversableContainer<?, Data> otherContainer, boolean shouldWork) {
    BeginTest("IsEqual");
    boolean result = ThisContainer().IsEqual(otherContainer);
    if (shouldWork) {
      assertTrue(result, "IsEqual (Traversable) should return true");
    } else {
      assertFalse(result, "IsEqual (Traversable) should return false");
    }
    EndTest();
  }

  default void TestAnyNull(boolean expected) {
    BeginTest("AnyNull");
    boolean result = ThisContainer().TraverseForward(dat -> dat == null);
    if (expected) {
      assertTrue(result, "The container should contain a null value");
    } else {
      assertFalse(result, "The container should not contain any null value");
    }
    EndTest();
  }

  default void TestPrintContent(String str) {
    BeginTest("PrintContent" + (str.isEmpty() ? "" : " ") + str);
    boolean result = ThisContainer()
      .TraverseForward(dat -> {
          System.out.print(dat);
          System.out.print(" ");
          return false;
        }
      );
    assertFalse(result, "TraverseForward inside PrintContent should return false");
    EndTest();
  }

}
