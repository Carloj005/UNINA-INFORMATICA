package zapsdtest.testframework.containers.base.ordered;

import static org.junit.jupiter.api.Assertions.*;

import apsd.interfaces.containers.base.ordered.OrderedRemovableContainer;

import zapsdtest.testframework.containers.base.RemovableContainerTest;

public interface OrderedRemovableContainerTest<Data extends Comparable<? super Data>, Con extends OrderedRemovableContainer<Con, Data>> extends OrderedContainerTest<Data, Con>, RemovableContainerTest<Data, Con> {

  default void TestRemoveMin() {
    BeginTest("RemoveMin");
    ThisContainer().RemoveMin();
    EndTest();
  }

  default void TestRemoveMax() {
    BeginTest("RemoveMax");
    ThisContainer().RemoveMax();
    EndTest();
  }

  default void TestMinNRemove(Data expectedElement) {
    BeginTest("MinNRemove");
    Data min = ThisContainer().MinNRemove();
    assertEquals(expectedElement, min, "MinNRemove should return " + expectedElement);
    EndTest();
  }

  default void TestMaxNRemove(Data expectedElement) {
    BeginTest("MaxNRemove");
    Data max = ThisContainer().MaxNRemove();
    assertEquals(expectedElement, max, "MaxNRemove should return " + expectedElement);
    EndTest();
  }

  default void TestRemovePredecessor(Data element) {
    BeginTest("RemovePredecessor");
    ThisContainer().RemovePredecessor(element);
    EndTest();
  }

  default void TestRemoveSuccessor(Data element) {
    BeginTest("RemoveSuccessor");
    ThisContainer().RemoveSuccessor(element);
    EndTest();
  }

  default void TestPredecessorNRemove(Data element, Data expectedElement) {
    BeginTest("PredecessorNRemove");
    Data pred = ThisContainer().PredecessorNRemove(element);
    assertEquals(expectedElement, pred, "Predecessor should return " + expectedElement);
    EndTest();
  }

  default void TestSuccessorNRemove(Data element, Data expectedElement) {
    BeginTest("SuccessorNRemove");
    Data succ = ThisContainer().SuccessorNRemove(element);
    assertEquals(expectedElement, succ, "Successor should return " + expectedElement);
    EndTest();
  }

}
