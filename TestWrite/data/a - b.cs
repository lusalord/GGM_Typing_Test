class Program
{
    static void Main(string[] args)
    {
        int[] arr = Array.ConvertAll(Console.ReadLine().Split(), int.Parse);

        Console.WriteLine(arr[0] - arr[1]);
    }
}