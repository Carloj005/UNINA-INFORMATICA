package zapsdtest.testframework.containers.collections.ordered;

import apsd.interfaces.containers.collections.ordered.SortedChain;

import zapsdtest.testframework.containers.sequences.ordered.SortedSequenceTest;

import static org.junit.jupiter.api.Assertions.*;

public interface SortedChainTest<Data extends Comparable<? super Data>, Con extends SortedChain<Con, Data>> extends OrderedChainTest<Data, Con>, SortedSequenceTest<Data, Con> {

  default void TestIntersection(SortedChain<?, Data> otherSet) {
    BeginTest("Intersection");
    long initialSize = ThisContainer().Size().ToLong();
    ThisContainer().Intersection(otherSet);
    assertTrue(ThisContainer().Size().ToLong() <= initialSize, "Size should not increase after Intersection");
    if (otherSet != null) {
      assertTrue(ThisContainer().FoldForward((dat, acc) -> otherSet.Exists(dat) && acc, true), "The input set should contain all elements of the new set after Intersection");
    }
    EndTest();
  }
}
