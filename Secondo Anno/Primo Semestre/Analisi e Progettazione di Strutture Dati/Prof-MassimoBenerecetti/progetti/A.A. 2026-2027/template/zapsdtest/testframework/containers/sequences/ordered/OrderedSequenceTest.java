package zapsdtest.testframework.containers.sequences.ordered;

import apsd.classes.utilities.Natural;
import apsd.interfaces.containers.sequences.ordered.OrderedSequence;
import zapsdtest.testframework.containers.base.ordered.OrderedIterableContainerTest;
import zapsdtest.testframework.containers.sequences.SequenceTest;

import static org.junit.jupiter.api.Assertions.*;

public interface OrderedSequenceTest<Data extends Comparable<? super Data>, Con extends OrderedSequence<Con, Data>> extends SequenceTest<Data, Con>, OrderedIterableContainerTest<Data, Con> {

  default void TestSearchPredecessor(Data element, Natural expectedPosition) {
    BeginTest("SearchPredecessor");
    Natural position = ThisContainer().SearchPredecessor(element);
    assertEquals(expectedPosition, position, "SearchPredecessor should return position " + expectedPosition + " for " + element);
    EndTest();
  }

  default void TestSearchSuccessor(Data element, Natural expectedPosition) {
    BeginTest("SearchSuccessor");
    Natural position = ThisContainer().SearchSuccessor(element);
    assertEquals(expectedPosition, position, "SearchSuccessor should return position " + expectedPosition + " for " + element);
    EndTest();
  }

}
